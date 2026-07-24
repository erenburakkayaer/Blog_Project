namespace BlogProject.API.Entities
{
    // Genel site ayarları (key-value)
    public class Setting
    {
        public int Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }
}
