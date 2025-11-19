using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComandasController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ComandasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("mesa/{mesaId}")]
        public async Task<IActionResult> GetComandasDaMesa(int mesaId)
        {
            var comandas = await _context.Comandas
                                         .Where(c => c.MesaId == mesaId)
                                         .ToListAsync();

            return Ok(comandas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetComanda(int id)
        {
            var comanda = await _context.Comandas.FindAsync(id);

            if (comanda == null)
                return NotFound();

            return Ok(comanda);
        }

        [HttpPost]
        public async Task<IActionResult> CriarComanda(Comanda comanda)
        {
            _context.Comandas.Add(comanda);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComanda), new { id = comanda.Id }, comanda);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarComanda(int id)
        {
            var comanda = await _context.Comandas.FindAsync(id);

            if (comanda == null)
                return NotFound();

            _context.Comandas.Remove(comanda);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}