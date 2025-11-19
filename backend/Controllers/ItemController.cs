using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItensComandaController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ItensComandaController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("comanda/{comandaId}")]
        public async Task<IActionResult> GetItensDaComanda(int comandaId)
        {
            var itens = await _context.ItensComanda
                                      .Where(i => i.ComandaId == comandaId)
                                      .ToListAsync();

            return Ok(itens);
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarItem(ItensComanda item)
        {
            _context.ItensComanda.Add(item);
            await _context.SaveChangesAsync();

            return Ok(item);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoverItem(int id)
        {
            var item = await _context.ItensComanda.FindAsync(id);

            if (item == null)
                return NotFound();

            _context.ItensComanda.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}