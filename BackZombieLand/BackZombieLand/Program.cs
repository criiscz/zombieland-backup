using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Data;
using BackZombieLand.services;
using BackZombieLand.services.implementation;
using BackZombieLand.Model;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.CodeAnalysis.Options;

var builder = WebApplication.CreateBuilder(args);

//****CORS SETTINGS**********
builder.Services.AddCors(options => {
    options.AddPolicy("Policy_authentication",
            policy => {
                policy.WithOrigins("*");
            });
    options.AddPolicy("Policy_any_origin",
           policy => {
               policy.WithOrigins("*")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
           });
});

//*****END CORS SETTINGS*****


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
builder.Services.AddSwaggerGen(option => {

    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


//app.UseCors("AllowWebApp");
app.UseCors();

app.UseAuthentication(); //here we say it that use the authentication!

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
