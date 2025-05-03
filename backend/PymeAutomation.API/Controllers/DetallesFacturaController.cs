using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PymeAutomation.API.Data;
using PymeAutomation.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PymeAutomation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetallesFacturaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DetallesFacturaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/DetallesFactura/factura/5
        [HttpGet("factura/{facturaId}")]
        public async Task<ActionResult<IEnumerable<DetalleFactura>>> GetDetallesPorFactura(int facturaId)
        {
            return await _context.DetallesFactura
                .Where(d => d.FacturaID == facturaId)
                .Include(d => d.Producto)
                .ToListAsync();
        }

        // GET: api/DetallesFactura/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DetalleFactura>> GetDetalleFactura(int id)
        {
            var detalleFactura = await _context.DetallesFactura
                .Include(d => d.Producto)
                .FirstOrDefaultAsync(d => d.DetalleFacturaID == id);

            if (detalleFactura == null)
            {
                return NotFound();
            }

            return detalleFactura;
        }

        // POST: api/DetallesFactura
        [HttpPost]
        public async Task<ActionResult<DetalleFactura>> PostDetalleFactura(DetalleFactura detalleFactura)
        {
            // Verificar que la factura existe
            var facturaExiste = await _context.Facturas.AnyAsync(f => f.FacturaID == detalleFactura.FacturaID);
            if (!facturaExiste)
            {
                return BadRequest("La factura especificada no existe");
            }

            // Verificar que el producto existe
            var producto = await _context.Productos.FindAsync(detalleFactura.ProductoID);
            if (producto == null)
            {
                return BadRequest("El producto especificado no existe");
            }

            // Establecer el precio unitario al precio actual del producto
            detalleFactura.PrecioUnitario = producto.PrecioUnitario;

            // Calcular el subtotal
            detalleFactura.Subtotal = detalleFactura.Cantidad * detalleFactura.PrecioUnitario;

            _context.DetallesFactura.Add(detalleFactura);
            await _context.SaveChangesAsync();

            // Actualizar el monto total de la factura
            var factura = await _context.Facturas.FindAsync(detalleFactura.FacturaID);
            factura.MontoTotal = await _context.DetallesFactura
                .Where(d => d.FacturaID == detalleFactura.FacturaID)
                .SumAsync(d => d.Subtotal);

            // Actualizar el stock del producto
            producto.StockActual -= detalleFactura.Cantidad;
            if (producto.StockActual < 0)
            {
                producto.StockActual = 0;
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDetalleFactura), new { id = detalleFactura.DetalleFacturaID }, detalleFactura);
        }

        // PUT: api/DetallesFactura/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalleFactura(int id, DetalleFactura detalleFactura)
        {
            if (id != detalleFactura.DetalleFacturaID)
            {
                return BadRequest();
            }

            // Obtener el detalle actual para calcular la diferencia de stock
            var detalleActual = await _context.DetallesFactura.FindAsync(id);
            if (detalleActual == null)
            {
                return NotFound();
            }

            // Calcular la diferencia de cantidad
            int diferenciaCantidad = detalleFactura.Cantidad - detalleActual.Cantidad;

            // Actualizar el subtotal
            detalleFactura.Subtotal = detalleFactura.Cantidad * detalleFactura.PrecioUnitario;

            _context.Entry(detalleActual).State = EntityState.Detached;
            _context.Entry(detalleFactura).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                // Actualizar el monto total de la factura
                var factura = await _context.Facturas.FindAsync(detalleFactura.FacturaID);
                factura.MontoTotal = await _context.DetallesFactura
                    .Where(d => d.FacturaID == detalleFactura.FacturaID)
                    .SumAsync(d => d.Subtotal);

                // Actualizar el stock del producto
                if (diferenciaCantidad != 0)
                {
                    var producto = await _context.Productos.FindAsync(detalleFactura.ProductoID);
                    if (producto != null)
                    {
                        producto.StockActual -= diferenciaCantidad;
                        if (producto.StockActual < 0)
                        {
                            producto.StockActual = 0;
                        }
                    }
                }

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DetalleFacturaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/DetallesFactura/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetalleFactura(int id)
        {
            var detalleFactura = await _context.DetallesFactura.FindAsync(id);
            if (detalleFactura == null)
            {
                return NotFound();
            }

            // Guardar información para actualizaciones posteriores
            int facturaID = detalleFactura.FacturaID;
            int productoID = detalleFactura.ProductoID;
            int cantidad = detalleFactura.Cantidad;

            _context.DetallesFactura.Remove(detalleFactura);
            await _context.SaveChangesAsync();

            // Actualizar el monto total de la factura
            var factura = await _context.Facturas.FindAsync(facturaID);
            if (factura != null)
            {
                factura.MontoTotal = await _context.DetallesFactura
                    .Where(d => d.FacturaID == facturaID)
                    .SumAsync(d => d.Subtotal);

                // Devolver los productos al inventario
                var producto = await _context.Productos.FindAsync(productoID);
                if (producto != null)
                {
                    producto.StockActual += cantidad;
                }

                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

        private bool DetalleFacturaExists(int id)
        {
            return _context.DetallesFactura.Any(e => e.DetalleFacturaID == id);
        }
    }
}