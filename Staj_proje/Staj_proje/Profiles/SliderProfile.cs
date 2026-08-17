using Mapster;
using Staj_proje.DTO.Slider;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    public class SliderProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // 1. SliderCreateDto -> Slider[cite: 1, 4]
            config.NewConfig<SliderCreateDto, Slider>()
                .Ignore(dest => dest.Id)              // Entity Id'si veritabanı/EF Core tarafından yönetilir
                .Ignore(dest => dest.CreatedAt)       // Varsayılan DateTime.UtcNow değeri korunur
                .Ignore(dest => dest.IsDeleted)       // Varsayılan false değeri korunur[cite: 4]
                .Ignore(dest => dest.ImageFileAsset); // Navigation Property ilişki yönetimine bırakılır[cite: 4]

            // 2. SliderUpdateDto -> Slider (Mevcut Entity'yi Güncellerken)[cite: 3, 4]
            config.NewConfig<SliderUpdateDto, Slider>()
                .Ignore(dest => dest.Id)              // Güncellemede Id değişmemeli[cite: 4]
                .Ignore(dest => dest.CreatedAt)       // Oluşturulma tarihi ezilmemeli[cite: 4]
                .Ignore(dest => dest.IsDeleted)       // Silindi bilgisi korunmalı[cite: 4]
                .Ignore(dest => dest.ImageFileAsset); // Navigation Property ezilmemeli[cite: 4]

            // 3. Slider -> SliderResponseDto[cite: 2, 4]
            config.NewConfig<Slider, SliderResponseDto>()
                .Map(dest => dest.ImageUrl,
                     src => src.ImageFileAsset != null ? src.ImageFileAsset.FilePath : string.Empty);
        }
    }
}