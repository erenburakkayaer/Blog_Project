using BlogProject.API.Helpers;

namespace BlogProject.Tests.Helpers
{
    public class PasswordHasherTests
    {
        [Fact]
        public void Verify_DogruParolaIle_TrueDoner()
        {
            var hash = PasswordHasher.Hash("Admin123!");

            Assert.True(PasswordHasher.Verify("Admin123!", hash));
        }

        [Fact]
        public void Verify_YanlisParolaIle_FalseDoner()
        {
            var hash = PasswordHasher.Hash("Admin123!");

            Assert.False(PasswordHasher.Verify("YanlisParola1!", hash));
        }

        [Fact]
        public void Hash_AyniParolaIcinFarkliSaltUretir()
        {
            var hash1 = PasswordHasher.Hash("Admin123!");
            var hash2 = PasswordHasher.Hash("Admin123!");

            Assert.NotEqual(hash1, hash2);
        }
    }
}
