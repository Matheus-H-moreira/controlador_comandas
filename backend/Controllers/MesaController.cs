using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MesaController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MesaController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetListaMesas()
        {
            var mesas = await _context.Mesas.ToListAsync();
            return Ok(mesas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMesaUnica(int id)
        {
            var mesa = await _context.Mesas.FindAsync(id);

            if(mesa == null)
                return NotFound();

            return Ok(mesa);
        }

        [HttpPost]
        public async Task<IActionResult> CriarMesa(Mesa mesa)
        {
            _context.Mesas.Add(mesa);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMesaUnica), new { id = mesa.Id }, mesa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarMesa(int id, Mesa mesaAtualizada)
        {
            var mesa = await _context.Mesas.FindAsync(id);

            if (mesa == null)
                return NotFound(new { message = "Mesa não encontrada" });

            mesa.NumeroMesa = mesaAtualizada.NumeroMesa;
            mesa.QuantidadeClientes = mesaAtualizada.QuantidadeClientes;
            mesa.StatusMesa = mesaAtualizada.StatusMesa;

            await _context.SaveChangesAsync();

            return Ok(mesa);
        
        }
    }
}