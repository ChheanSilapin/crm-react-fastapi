import { PhotoIcon, XIcon } from '../../../icons';
import { getAssetUrl } from '../../../api/assetUrl';

const BankForm = ({
  formData,
  errors,
  logoPreview,
  handleInputChange,
  handleFileChange,
  removeLogo,
  onSubmit
}) => {
  // Base input classes
  const inputBaseClasses = "w-full px-2 py-1.5 sm:px-3 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 transition-colors";

  const mergeClasses = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <form id="bank-form" onSubmit={onSubmit} autoComplete="off" className="space-y-3 sm:space-y-4 md:space-y-5">
      {/* Bank Name - Full width */}
      <div>
        <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
          Bank Name *
        </label>
        <input
          type="text"
          name="bank_name"
          value={formData.bank_name}
          onChange={handleInputChange}
          required
          autoComplete="off"
          className={mergeClasses(inputBaseClasses, errors.bank_name ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
          placeholder="e.g., ABA Bank, ACLEDA Bank"
        />
        {errors.bank_name && (
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.bank_name}</p>
        )}
      </div>

      {/* Description - Full width */}
      <div>
        <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          autoComplete="off"
          rows="3"
          className={mergeClasses(inputBaseClasses, errors.description ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
          placeholder="Aurora of financial opportunities"
        />
        {errors.description && (
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>

      {/* Logo Upload - Full width */}
      <div>
        <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
          Bank Logo
        </label>
        <div className="flex items-center space-x-4">
          {/* Logo Preview */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800 relative">
              {logoPreview ? (
                <>
                  <img
                    src={getAssetUrl(logoPreview)}
                    alt="Bank logo preview"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <PhotoIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Logo</span>
                </div>
              )}
            </div>
          </div>

          {/* File Input */}
          <div className="flex-1">
            <input
              type="file"
              name="logo"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="block w-full text-xs sm:text-sm text-gray-500 dark:text-gray-400
                file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4
                file:rounded-lg file:border-0
                file:text-xs sm:file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-blue-900 dark:file:text-blue-300"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG, GIF up to 2MB
            </p>
          </div>
        </div>
        {errors.logo && (
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.logo}</p>
        )}
      </div>

    </form>
  );
};

export default BankForm;
