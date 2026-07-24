namespace BlogProject.API.Helpers
{
    // [Authorize(Roles = ...)] compile-time sabit gerektirdiği için burada tutuluyor
    public static class RoleNames
    {
        public const string SuperAdmin = "SuperAdmin";
        public const string Admin = "Admin";
        public const string Editor = "Editor";
        public const string Yazar = "Yazar";

        public const string AdminOnly = SuperAdmin + "," + Admin;
    }
}
