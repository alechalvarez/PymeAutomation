using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PymeAutomation.API.Data;
using PymeAutomation.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PymeAutomation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FacturasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Facturas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Factura>>> GetFacturas()
        {
            return await _context.Facturas
                .Include(f => f.Cliente)
                .ToListAsync();
        }

        // GET: api/Facturas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Factura>> GetFactura(int id)
        {
            var factura = await _context.Facturas
                .Include(f => f.Cliente)
                .Include(f => f.DetallesFactura)
                    .ThenInclude(d => d.Producto)
                .FirstOrDefaultAsync(f => f.FacturaID == id);

            if (factura == null)
            {
                return NotFound();
            }

            return factura;
        }

        // POST: api/Facturas
        [HttpPost]
        public async Task<ActionResult<Factura>> PostFactura(Factura factura)
        {
            // Verificar que el cliente existe
            var clienteExiste = await _context.Clientes.AnyAsync(c => c.ClienteID == factura.ClienteID);
            if (!clienteExiste)
            {
                return BadRequest("El cliente especificado no existe");
            }

            // Generar número de factura (ejemplo: F-2025-001)
            int ultimoNumero = await _context.Facturas
                .Where(f => f.NumeroFactura.StartsWith("F-2025-"))
                .Select(f => int.Parse(f.NumeroFactura.Substring(7)))
                .DefaultIfEmpty(0)
                .MaxAsync();

            factura.NumeroFactura = $"F-2025-{(ultimoNumero + 1).ToString("D3")}";
            factura.FechaFactura = DateTime.Now;
            factura.FechaCreacion = DateTime.Now;
            factura.Estado = "Pendiente";

            // Calcular el total de la factura
            factura.MontoTotal = factura.DetallesFactura.Sum(d => d.Subtotal);

            // Agregar la factura y sus detalles
            _context.Facturas.Add(factura);

            try
            {
                await _context.SaveChangesAsync();

                // Actualizar el stock de los productos
                foreach (var detalle in factura.DetallesFactura)
                {
                    var producto = await _context.Productos.FindAsync(detalle.ProductoID);
                    if (producto != null)
                    {
                        producto.StockActual -= detalle.Cantidad;
                        if (producto.StockActual < 0)
                        {
                            producto.StockActual = 0;
                        }
                    }
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al guardar la factura: {ex.Message}");
            }

            return CreatedAtAction(nameof(GetFactura), new { id = factura.FacturaID }, factura);
        }

        // PUT: api/Facturas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFactura(int id, Factura factura)
        {
            if (id != factura.FacturaID)
            {
                return BadRequest();
            }

            // Solo permitir actualizar el estado de la factura
            var facturaExistente = await _context.Facturas.FindAsync(id);
            if (facturaExistente == null)
            {
                return NotFound();
            }

            facturaExistente.Estado = factura.Estado;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FacturaExists(id))
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

        // DELETE: api/Facturas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFactura(int id)
        {
            var factura = await _context.Facturas
                .Include(f => f.DetallesFactura)
                .FirstOrDefaultAsync(f => f.FacturaID == id);

            if (factura == null)
            {
                return NotFound();
            }

            // Devolver los productos al inventario
            foreach (var detalle in factura.DetallesFactura)
            {
                var producto = await _context.Productos.FindAsync(detalle.ProductoID);
                if (producto != null)
                {
                    producto.StockActual += detalle.Cantidad;
                }
            }

            _context.DetallesFactura.RemoveRange(factura.DetallesFactura);
            _context.Facturas.Remove(factura);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FacturaExists(int id)
        {
            return _context.Facturas.Any(e => e.FacturaID == id);
        }
    }
}