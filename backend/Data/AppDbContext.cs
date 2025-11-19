using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Mesa> Mesas { get; set; }
        public DbSet<Comanda> Comandas { get; set; }
        public DbSet<ItensComanda> ItensComanda { get; set; }
        public DbSet<Produto> Produtos { get; set; }
    }
}