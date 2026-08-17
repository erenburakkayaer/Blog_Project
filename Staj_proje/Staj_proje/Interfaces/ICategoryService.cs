using Staj_proje.DTO.Category;

namespace Staj_proje.Services.Interfaces
{
    public interface ICategoryService
    {
        // Create
        Task<int> CreateCategoryAsync(CategoryCreateDto createCategoryDto);
        
        // Read
        Task<CategoryListDto> GetCategoryByIdAsync(int id);
        Task<List<CategoryListDto>> GetAllCategoriesAsync();
        Task<List<CategoryListDto>> GetActiveCategoriesAsync();
        
        // Update
        Task<bool> UpdateCategoryAsync(int id, CategoryUpdateDto updateCategoryDto);
        Task<bool> ActivateCategoryAsync(int id);
        Task<bool> DeactivateCategoryAsync(int id);
        
        // Delete
        Task<bool> DeleteCategoryAsync(int id);
        Task<bool> RestoreCategoryAsync(int id);
        Task<bool> PermanentlyDeleteCategoryAsync(int id);
        
        // Search
        Task<List<CategoryListDto>> SearchCategoriesAsync(string keyword);
        
        // Validation & Check
        Task<bool> IsCategoryExistsAsync(int id);
        Task<bool> IsCategoryNameExistsAsync(string name);
        Task<bool> IsCategoryActiveAsync(int id);
    }
}