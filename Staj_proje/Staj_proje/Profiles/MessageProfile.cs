using Mapster;
using Staj_proje.DTO.Message;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    /// <summary>
    /// Message entity ve DTO'ları arasındaki Mapster eşleştirme kuralları.
    /// Program.cs içinde:
    ///     var mapsterConfig = TypeAdapterConfig.GlobalSettings;
    ///     mapsterConfig.Scan(Assembly.GetExecutingAssembly());
    /// şeklinde otomatik taranır (IRegister implemente ettiği için).
    /// </summary>
    public class MessageProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // ------------------------------------------------------------
            // Message -> MessageListDto
            // ------------------------------------------------------------
            config.NewConfig<Message, MessageListDto>()
                .Map(dest => dest.CompanyName, src => src.Company.Name)
                .Map(dest => dest.HasAttachment, src => src.AttachmentFileId != null);

            // ------------------------------------------------------------
            // Message -> MessageDetailDto
            // ------------------------------------------------------------
            config.NewConfig<Message, MessageDetailDto>()
                .Map(dest => dest.CompanyName, src => src.Company.Name)
                .Map(dest => dest.SenderUserName,
                     src => src.User != null ? src.User.FirstName + " " + src.User.LastName : null) // User entity'sindeki gerçek alan adına göre düzenleyin (FirstName+LastName vb. olabilir)
                .Map(dest => dest.AttachmentFileUrl,
                     src => src.AttachmentFile != null ? src.AttachmentFile.FilePath : null); // FileAsset'te "Url" yerine "FilePath" var

            // ------------------------------------------------------------
            // MessageCreateDto -> Message (yeni mesaj oluşturma - iletişim formu)
            // ------------------------------------------------------------
            config.NewConfig<MessageCreateDto, Message>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.Company)
                .Ignore(dest => dest.UserId)      // Giriş yapmış kullanıcı varsa servis katmanında set edilir
                .Ignore(dest => dest.User)
                .Ignore(dest => dest.AttachmentFile)
                .Ignore(dest => dest.Status)      // Varsayılan olarak MessageStatus.New kalır
                .Ignore(dest => dest.AdminNote)
                .Ignore(dest => dest.ReplyMessage)
                .Ignore(dest => dest.RepliedAt)
                .Ignore(dest => dest.IpAddress)   // İstek üzerinden (HttpContext) servis katmanında set edilir
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.IsDeleted);

            // ------------------------------------------------------------
            // MessageAdminUpdateDto -> Message (admin panelinden durum/not güncelleme)
            // Kullanım: adminUpdateDto.Adapt(existingMessageEntity);
            // ------------------------------------------------------------
            config.NewConfig<MessageAdminUpdateDto, Message>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.CompanyId)
                .Ignore(dest => dest.Company)
                .Ignore(dest => dest.FullName)
                .Ignore(dest => dest.Email)
                .Ignore(dest => dest.Phone)
                .Ignore(dest => dest.Subject)
                .Ignore(dest => dest.Content)
                .Ignore(dest => dest.UserId)
                .Ignore(dest => dest.User)
                .Ignore(dest => dest.AttachmentFileId)
                .Ignore(dest => dest.AttachmentFile)
                .Ignore(dest => dest.ReplyMessage)
                .Ignore(dest => dest.RepliedAt)
                .Ignore(dest => dest.IpAddress)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.IsDeleted);

            // ------------------------------------------------------------
            // MessageReplyDto -> Message (yanıt gönderme)
            // Kullanım: replyDto.Adapt(existingMessageEntity);
            // Ardından servis katmanında: existingMessage.RepliedAt = DateTime.UtcNow;
            //                             existingMessage.Status = MessageStatus.Replied;
            // ------------------------------------------------------------
            config.NewConfig<MessageReplyDto, Message>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.CompanyId)
                .Ignore(dest => dest.Company)
                .Ignore(dest => dest.FullName)
                .Ignore(dest => dest.Email)
                .Ignore(dest => dest.Phone)
                .Ignore(dest => dest.Subject)
                .Ignore(dest => dest.Content)
                .Ignore(dest => dest.UserId)
                .Ignore(dest => dest.User)
                .Ignore(dest => dest.AttachmentFileId)
                .Ignore(dest => dest.AttachmentFile)
                .Ignore(dest => dest.Status)      // Status/RepliedAt Mapster dışında servis katmanında set edilmeli
                .Ignore(dest => dest.RepliedAt)
                .Ignore(dest => dest.AdminNote)
                .Ignore(dest => dest.IpAddress)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.IsDeleted);
        }
    }
}