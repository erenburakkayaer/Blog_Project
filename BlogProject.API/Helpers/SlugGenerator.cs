using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace BlogProject.API.Helpers
{
    // Türkçe karakterleri ASCII karşılığına çevirip URL-güvenli slug üretir
    // (frontend'deki createSlug fonksiyonuyla aynı mantık) — Blog ve Project modülleri ortak kullanır
    public static class SlugGenerator
    {
        public static string Generate(string text)
        {
            var normalized = text.Trim().ToLower(new CultureInfo("tr-TR"))
                .Replace("ğ", "g").Replace("ü", "u").Replace("ş", "s")
                .Replace("ı", "i").Replace("ö", "o").Replace("ç", "c");

            var builder = new StringBuilder();
            foreach (var ch in normalized)
            {
                if (char.IsLetterOrDigit(ch) || ch == ' ' || ch == '-')
                    builder.Append(ch);
            }

            return Regex.Replace(builder.ToString(), @"[\s-]+", "-").Trim('-');
        }
    }
}
