using Mapster;
using Staj_proje.DTO.Category;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IGenericRepository<Category> _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(
            IGenericRepository<Category> categoryRepository,
            IUnitOfWork unitOfWork)
        {
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
        }

        #region CREATE

        /// <summary>
        /// Yeni bir kategori oluşturur
        /// </summary>
        public async Task<int> CreateCategoryAsync(CategoryCreateDto createCategoryDto)
        {
            if (string.IsNullOrWhiteSpace(createCategoryDto.Name))
                throw new ArgumentException("Kategori adı boş olamaz.", nameof(createCategoryDto.Name));

            // Aynı isimde kategori var mı kontrolü
            if (await IsCategoryNameExistsAsync(createCategoryDto.Name))
                throw new InvalidOperationException($"'{createCategoryDto.Name}' isimli bir kategori zaten mevcut.");

            var category = new Category
            {
                Name = createCategoryDto.Name.Trim(),
                Description = createCategoryDto.Description,
                IsActive = createCategoryDto.IsActive,
                IsDeleted = false
            };

            await _categoryRepository.AddAsync(category);
            await _unitOfWork.CommitAsync();

            return category.Id;
        }

        #endregion

        #region READ

        /// <summary>
        /// ID'ye göre kategoriyi getirir
        /// </summary>
        public async Task<CategoryListDto> GetCategoryByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null || category.IsDeleted)
                throw new InvalidOperationException($"Kategori ID: {id} bulunamadı.");

            return category.Adapt<CategoryListDto>();
        }

        /// <summary>
        /// Silinmemiş tüm kategorileri listeler
        /// </summary>
        public async Task<List<CategoryListDto>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.FindAsync(c => !c.IsDeleted);
            return categories.OrderBy(c => c.Name).ToList().Adapt<List<CategoryListDto>>();
        }

        /// <summary>
        /// Sadece aktif ve silinmemiş kategorileri listeler
        /// </summary>
        public async Task<List<CategoryListDto>> GetActiveCategoriesAsync()
        {
            var categories = await _categoryRepository.FindAsync(c => !c.IsDeleted && c.IsActive);
            return categories.OrderBy(c => c.Name).ToList().Adapt<List<CategoryListDto>>();
        }

        #endregion

        #region UPDATE

        /// <summary>
        /// Kategori bilgilerini günceller
        /// </summary>
        public async Task<bool> UpdateCategoryAsync(int id, CategoryUpdateDto updateCategoryDto)
        {
            if (string.IsNullOrWhiteSpace(updateCategoryDto.Name))
                throw new ArgumentException("Kategori adı boş olamaz.", nameof(updateCategoryDto.Name));

            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null || category.IsDeleted)
                throw new InvalidOperationException($"Kategori ID: {id} bulunamadı.");

            // Başka bir kategoride aynı isim var mı kontrolü
            var trimmedName = updateCategoryDto.Name.Trim().ToLower();
            var existingCategories = await _categoryRepository.FindAsync(c =>
                !c.IsDeleted &&
                c.Id != id &&
                c.Name.ToLower() == trimmedName
            );

            if (existingCategories.Any())
                throw new InvalidOperationException($"'{updateCategoryDto.Name}' isimli başka bir kategori zaten mevcut.");

            updateCategoryDto.Adapt(category);
            category.Name = updateCategoryDto.Name.Trim();

            _categoryRepository.Update(category);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Kategoriyi aktifleştirir
        /// </summary>
        public async Task<bool> ActivateCategoryAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null || category.IsDeleted)
                throw new InvalidOperationException($"Kategori ID: {id} bulunamadı.");

            if (category.IsActive)
                throw new InvalidOperationException("Bu kategori zaten aktif durumda.");

            category.IsActive = true;

            _categoryRepository.Update(category);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Kategoriyi pasifleştirir
        /// </summary>
        public async Task<bool> DeactivateCategoryAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null || category.IsDeleted)
                throw new InvalidOperationException($"Kategori ID: {id} bulunamadı.");

            if (!category.IsActive)
                throw new InvalidOperationException("Bu kategori zaten pasif durumda.");

            category.IsActive = false;

            _categoryRepository.Update(category);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region DELETE

        /// <summary>
        /// Kategoriyi siler (Soft Delete - IsDeleted = true)
        /// </summary>
        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
                throw new InvalidOperationException($"Kategori ID: {id} bulunamadı.");

            if (category.IsDeleted)
                throw new InvalidOperationException("Bu kategori zaten silinmiş durumda.");

            _categoryRepository.Remove(category); // Soft Delete
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Silinen kategoriyi geri yükler (IsDeleted = false)
        /// </summary>
        public async Task<bool> RestoreCategoryAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
                throw new InvalidOperationException($"Kategori ID: {id} bulunamadı.");

            if (!category.IsDeleted)
                throw new InvalidOperationException("Bu kategori silinmemiş durumda.");

            _categoryRepository.Restore(category);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Kategoriyi veritabanından kalıcı olarak siler (Hard Delete)
        /// </summary>
        public async Task<bool> PermanentlyDeleteCategoryAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
                throw new InvalidOperationException($"Kategori ID: {id} bulunamadı.");

            _categoryRepository.HardDelete(category);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region SEARCH

        /// <summary>
        /// İsim veya açıklamaya göre kategori arar
        /// </summary>
        public async Task<List<CategoryListDto>> SearchCategoriesAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                throw new ArgumentException("Arama kelimesi boş olamaz.", nameof(keyword));

            var trimmedKeyword = keyword.Trim();

            var categories = await _categoryRepository.FindAsync(c =>
                !c.IsDeleted &&
                (c.Name.Contains(trimmedKeyword) || (c.Description != null && c.Description.Contains(trimmedKeyword)))
            );

            return categories.OrderBy(c => c.Name).ToList().Adapt<List<CategoryListDto>>();
        }

        #endregion

        #region VALIDATION & CHECK

        /// <summary>
        /// Kategorinin var olup olmadığını ve silinmemiş olduğunu kontrol eder
        /// </summary>
        public async Task<bool> IsCategoryExistsAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            return category != null && !category.IsDeleted;
        }

        /// <summary>
        /// Aynı isimde silinmemiş bir kategori olup olmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsCategoryNameExistsAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            var trimmedName = name.Trim().ToLower();
            var categories = await _categoryRepository.FindAsync(c =>
                !c.IsDeleted &&
                c.Name.ToLower() == trimmedName
            );

            return categories.Any();
        }

        /// <summary>
        /// Kategorinin aktif olup olmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsCategoryActiveAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            return category != null && !category.IsDeleted && category.IsActive;
        }

        #endregion
    }
}
