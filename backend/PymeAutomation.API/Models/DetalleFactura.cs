using System.ComponentModel.DataAnnotations.Schema;

namespace PymeAutomation.API.Models
{
    public class DetalleFactura
    {
        public int DetalleFacturaID { get; set; }
        public int FacturaID { get; set; }
        public int ProductoID { get; set; }
        public int Cantidad { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitario { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        // Propiedades de navegación
        public Factura Factura { get; set; }
        public Producto Producto { get; set; }
    }
}