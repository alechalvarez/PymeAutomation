using System.ComponentModel.DataAnnotations.Schema;


namespace PymeAutomation.API.Models
{
    public class Producto
    {
        public int ProductoID { get; set; }
        public string CodigoProducto { get; set; }
        public string NombreProducto { get; set; }
        public string Categoria { get; set; }
        public int StockActual { get; set; }
        public int StockMinimo { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitario { get; set; }
        public string Proveedor { get; set; }
        public DateTime FechaCreacion { get; set; }

        // Propiedad de navegación
        public ICollection<DetalleFactura> DetallesFactura { get; set; }
    }
}