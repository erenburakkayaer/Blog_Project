using Mapster;
using Staj_proje.DTO.FileAsset;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    /// <summary>
    /// FileAsset entity ve DTO'ları arasındaki Mapster eşleştirme kuralları.
    /// Program.cs içinde:
    ///     var mapsterConfig = TypeAdapterConfig.GlobalSettings;
    ///     mapsterConfig.Scan(Assembly.GetExecutingAssembly());
    /// şeklinde otomatik taranır (IRegister implemente ettiği için).
    /// </summary>
    public class FileAssetProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // ------------------------------------------------------------
            // FileAsset -> FileAssetResponseDto
            // ------------------------------------------------------------
            // Not: Entity'de "Url" alanı yok, "FilePath" var. Eğer FilePath
            // doğrudan erişilebilir bir URL değilse (örn. sadece dosya yolu
            // tutuluyorsa), burada base URL ile birleştirme yapmanız gerekir.
            // Örn: src => $"{baseUrl}{src.FilePath}{src.StoredFileName}"
            config.NewConfig<Entities.FileAsset, FileAssetResponseDto>()
                .Map(dest => dest.Url, src => src.FilePath)
                .Map(dest => dest.UploadedByUserName,
                     src => src.UploadedByUser.UserName); // User entity'sindeki gerçek alan adına göre düzenleyin (Ad Soyad vb. olabilir)

            // ------------------------------------------------------------
            // FileAssetUploadDto -> FileAsset (yeni dosya kaydı oluşturma)
            // ------------------------------------------------------------
            // Not: "File" (IFormFile) doğrudan entity'ye map edilemez.
            // OriginalFileName, StoredFileName, FilePath, ContentType,
            // FileSizeBytes ve UploadedByUserId gibi alanlar dosya fiziksel
            // olarak kaydedildikten sonra servis katmanında elle set edilmelidir.
            // Bu yüzden Adapt yerine genellikle "new FileAsset { ... }" ile
            // manuel oluşturma tercih edilir. Yine de FileCategory gibi
            // doğrudan eşleşen alanlar için config aşağıda tanımlandı.
            config.NewConfig<FileAssetUploadDto, Entities.FileAsset>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.OriginalFileName)
                .Ignore(dest => dest.StoredFileName)
                .Ignore(dest => dest.FilePath)
                .Ignore(dest => dest.ContentType)
                .Ignore(dest => dest.FileSizeBytes)
                .Ignore(dest => dest.UploadedByUserId)
                .Ignore(dest => dest.UploadedByUser)
                .Ignore(dest => dest.UploadedAt)
                .Ignore(dest => dest.IsDeleted);

            // ------------------------------------------------------------
            // FileAssetUpdateDto -> FileAsset (mevcut kayıt üzerine güncelleme)
            // Sadece OriginalFileName ve FileCategory güncellenebilir alanlar.
            // Kullanım: updateDto.Adapt(existingFileAssetEntity);
            // ------------------------------------------------------------
            config.NewConfig<FileAssetUpdateDto, Entities.FileAsset>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.StoredFileName)
                .Ignore(dest => dest.FilePath)
                .Ignore(dest => dest.ContentType)
                .Ignore(dest => dest.FileSizeBytes)
                .Ignore(dest => dest.UploadedByUserId)
                .Ignore(dest => dest.UploadedByUser)
                .Ignore(dest => dest.UploadedAt)
                .Ignore(dest => dest.IsDeleted);
        }
    }
}
