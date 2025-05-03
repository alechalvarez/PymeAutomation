namespace PymeAutomation.API.Models
{
    public class Cliente
    {
        public int ClienteID { get; set; }
        public string NombreEmpresa { get; set; }
        public string NombreContacto { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public string Ciudad { get; set; }
        public string NIT { get; set; }
        public DateTime FechaCreacion { get; set; }

        // Propiedad de navegación
        public ICollection<Factura> Facturas { get; set; }
    }
}