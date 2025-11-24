using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace restauranteAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItensComanda_ItensComanda_ItensComandaId",
                table: "ItensComanda");

            migrationBuilder.DropIndex(
                name: "IX_ItensComanda_ItensComandaId",
                table: "ItensComanda");

            migrationBuilder.DropColumn(
                name: "ItensComandaId",
                table: "ItensComanda");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Comandas",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ItensComandaId",
                table: "ItensComanda",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Comandas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ItensComanda_ItensComandaId",
                table: "ItensComanda",
                column: "ItensComandaId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItensComanda_ItensComanda_ItensComandaId",
                table: "ItensComanda",
                column: "ItensComandaId",
                principalTable: "ItensComanda",
                principalColumn: "Id");
        }
    }
}
