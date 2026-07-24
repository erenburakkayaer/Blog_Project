namespace BlogProject.API.DTO
{
    // Sadece personel kullanır — teklif durumunu güncelleme
    public class OfferUpdateDto
    {
        public string Status { get; set; } = string.Empty;
    }
}
