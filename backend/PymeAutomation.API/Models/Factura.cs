using System.ComponentModel.DataAnnotations.Schema;


namespace PymeAutomation.API.Models
{
    public class Factura
    {
        public int FacturaID { get; set; }
        public string NumeroFactura { get; set; }
        public int ClienteID { get; set; }
        public DateTime FechaFactura { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal MontoTotal { get; set; }
        public string Estado { get; set; } // "Pendiente" o "Pagada"
        public DateTime FechaCreacion { get; set; }

        // Propiedades de navegación
        public Cliente Cliente { get; set; }
        public ICollection<DetalleFactura> DetallesFactura { get; set; }
    }
}