using Mapster;
using Staj_proje.DTO.Offer;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    /// <summary>
    /// Offer entity ve DTO'ları arasındaki Mapster eşleştirme kuralları.
    /// Program.cs içinde:
    ///     var mapsterConfig = TypeAdapterConfig.GlobalSettings;
    ///     mapsterConfig.Scan(Assembly.GetExecutingAssembly());
    /// şeklinde otomatik taranır (IRegister implemente ettiği için).
    /// </summary>
    public class OfferProfile: IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // ------------------------------------------------------------
            // Offer -> OfferListDto
            // ------------------------------------------------------------
            config.NewConfig<Offer, OfferListDto>()
                .Map(dest => dest.CompanyName, src => src.Company.Name)
                .Map(dest => dest.CompanyServiceName,
                     src => src.CompanyService != null ? src.CompanyService.Title : null);

            // ------------------------------------------------------------
            // Offer -> OfferDetailDto
            // ------------------------------------------------------------
            config.NewConfig<Offer, OfferDetailDto>()
                .Map(dest => dest.CompanyName, src => src.Company.Name)
                .Map(dest => dest.CompanyServiceName,
                     src => src.CompanyService != null ? src.CompanyService.Title : null)
                .Map(dest => dest.RequesterUserName,
                     src => src.RequesterUser != null ? src.RequesterUser.FirstName + " " + src.RequesterUser.LastName : null) // User entity'sindeki gerçek alan adına göre düzenleyin (FirstName+LastName vb. olabilir)
                .Map(dest => dest.RequirementFileUrl,
                     src => src.RequirementFile != null ? src.RequirementFile.FilePath : null)
                .Map(dest => dest.ProposalFileUrl,
                     src => src.ProposalFile != null ? src.ProposalFile.FilePath : null);

            // ------------------------------------------------------------
            // OfferCreateDto -> Offer (müşteri tarafından yeni teklif talebi oluşturma)
            // ------------------------------------------------------------
            config.NewConfig<OfferCreateDto, Offer>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.Company)
                .Ignore(dest => dest.CompanyService)
                .Ignore(dest => dest.RequesterUserId)  // Servis katmanında oturum açan kullanıcıdan set edilir
                .Ignore(dest => dest.RequesterUser)
                .Ignore(dest => dest.OfferedPrice)
                .Ignore(dest => dest.Currency)         // Varsayılan "TL" entity'den gelir
                .Ignore(dest => dest.ProposalNotes)
                .Ignore(dest => dest.ProposalFileId)
                .Ignore(dest => dest.ProposalFile)
                .Ignore(dest => dest.Status)           // Varsayılan OfferStatus.Pending kalır
                .Ignore(dest => dest.ValidUntil)
                .Ignore(dest => dest.RequirementFile)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.RespondedAt)
                .Ignore(dest => dest.IsDeleted);

            // ------------------------------------------------------------
            // OfferCompanyDto -> Offer (şirketin fiyat/teklif bilgilerini doldurması)
            // Kullanım: companyDto.Adapt(existingOfferEntity);
            // Ardından servis katmanında Status ve RespondedAt güncellenmeli
            // (örn. existingOffer.Status = OfferStatus.Sent; existingOffer.RespondedAt = DateTime.UtcNow;)
            // ------------------------------------------------------------
            config.NewConfig<OfferCompanyDto, Offer>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.CompanyId)
                .Ignore(dest => dest.Company)
                .Ignore(dest => dest.CompanyServiceId)
                .Ignore(dest => dest.CompanyService)
                .Ignore(dest => dest.RequesterUserId)
                .Ignore(dest => dest.RequesterUser)
                .Ignore(dest => dest.ContactName)
                .Ignore(dest => dest.ContactEmail)
                .Ignore(dest => dest.ContactPhone)
                .Ignore(dest => dest.Title)
                .Ignore(dest => dest.RequirementDetails)
                .Ignore(dest => dest.RequirementFileId)
                .Ignore(dest => dest.RequirementFile)
                .Ignore(dest => dest.Status)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.RespondedAt)
                .Ignore(dest => dest.IsDeleted);

            // ------------------------------------------------------------
            // OfferStatusUpdateDto -> Offer (admin/şirket teklif durumunu değiştirir)
            // Kullanım: statusDto.Adapt(existingOfferEntity);
            // ------------------------------------------------------------
            config.NewConfig<OfferStatusUpdateDto, Offer>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.CompanyId)
                .Ignore(dest => dest.Company)
                .Ignore(dest => dest.CompanyServiceId)
                .Ignore(dest => dest.CompanyService)
                .Ignore(dest => dest.RequesterUserId)
                .Ignore(dest => dest.RequesterUser)
                .Ignore(dest => dest.ContactName)
                .Ignore(dest => dest.ContactEmail)
                .Ignore(dest => dest.ContactPhone)
                .Ignore(dest => dest.Title)
                .Ignore(dest => dest.RequirementDetails)
                .Ignore(dest => dest.OfferedPrice)
                .Ignore(dest => dest.Currency)
                .Ignore(dest => dest.ProposalNotes)
                .Ignore(dest => dest.RequirementFileId)
                .Ignore(dest => dest.RequirementFile)
                .Ignore(dest => dest.ProposalFileId)
                .Ignore(dest => dest.ProposalFile)
                .Ignore(dest => dest.ValidUntil)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.RespondedAt)      // Servis katmanında Status değişince set edilmesi önerilir
                .Ignore(dest => dest.IsDeleted);
        }
    }
}
