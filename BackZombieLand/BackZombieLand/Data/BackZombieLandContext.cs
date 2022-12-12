using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BackZombieLand.Model;

namespace Data
{
    public class BackZombieLandContext : DbContext
    {
        public BackZombieLandContext (DbContextOptions<BackZombieLandContext> options)
            : base(options)
        {
        }

        public DbSet<Users> Users { get; set; } = default!;
    }
}
