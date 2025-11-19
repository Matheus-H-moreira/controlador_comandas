namespace backend.Models
{
    public class Comanda
    {
        public int Id { get; set; }
        public int MesaId { get; set; }
        public string? NomeCliente { get; set; }

        public Mesa? Mesa { get; set; }
    }
}