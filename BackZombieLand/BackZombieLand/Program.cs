using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Data;
using BackZombieLand.services;
using BackZombieLand.services.implementation;
using BackZombieLand.Model;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

const String keyConnectionString = "PostreSQLConnection";
var myConnectionString = builder.Configuration.GetConnectionString(keyConnectionString);
builder.Services.AddDbContext<BackZombieLandContext>(options =>
    options.UseNpgsql(myConnectionString));

// Add services to the container.

builder.Services.AddControllers();


var myAppSettingsSection = builder.Configuration.GetSection("AppSettings");
builder.Services.Configure<AppSettings>(myAppSettingsSection);

//JWT
var jwtKey = Encoding.ASCII.GetBytes(myAppSettingsSection.Get<AppSettings>().secret);
builder.Services.AddAuthentication(d => {
    d.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    d.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

})
    .AddJwtBearer(d => {
        d.RequireHttpsMetadata = false;
        d.SaveToken = true;
        d.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(jwtKey),//add the secret word
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

//Inject the user services trought scoped
builder.Services.AddScoped<IUserService, UserService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors("AllowWebApp");

app.UseAuthentication(); //here we say it that use the authentication!

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
