using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutoController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProdutoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetListaProdutos()
        {
            var produtos = await _context.Produtos.ToListAsync();
            return Ok(produtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);

            if(produto == null)
                return NotFound();

            return Ok(produto);
        }

        [HttpPost]
        public async Task<IActionResult> PostProduto(Produto produto)
        {
            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduto), new { id = produto.Id }, produto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarProduto(int id, Produto produtoAtualizado)
        {
            var produto = await _context.Produtos.FindAsync(id);

            if(produto == null)
                return NotFound(new { message = "Produto não encontrada" });

            produto.NomeProduto = produtoAtualizado.NomeProduto;
            produto.Preco = produtoAtualizado.Preco;
            produto.Categoria = produtoAtualizado.Categoria;
        
            await _context.SaveChangesAsync();

            return Ok(produto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);

            if (produto == null)
                return NotFound();

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}