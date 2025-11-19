namespace backend.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public string? NomeProduto { get; set; }
        public decimal Preco { get; set; }
        public string? Categoria { get; set; }
    }
}