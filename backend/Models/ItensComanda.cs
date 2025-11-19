namespace backend.Models
{
    public class ItensComanda
    {
        public int Id { get; set; }
        public int ComandaId { get; set; }
        public string? ItemPedido { get; set; }
        public int QuantidadeItem { get; set; }
        public decimal PrecoItem { get; set; }

        public Comanda? Comanda { get; set; }
    }
}