using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Mesa
    {
        public int Id { get; set; }
        public int NumeroMesa { get; set; }
        public int QuantidadeClientes { get; set; }
        public string? StatusMesa { get; set; }

        [JsonIgnore] 
        public List<Comanda>? Comandas { get; set; }
    }
}