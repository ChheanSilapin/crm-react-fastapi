import { useState, Fragment } from 'react';
import { BankIcon, PencilIcon, TrashIcon } from '../icons';
import { useBanks } from '../hooks/useBanks';
import { AddBankModal, EditBankModal, DeleteBankModal } from '../components/modals/banks';
import { formatDateOnly } from '../utils/currencyFormatter';
import { getAssetUrl } from '../api/assetUrl';

const Banks = () => {
  const {
    banks, loading, error, create, update,
    deleteBankWithValidation, isCreating, isUpdating, isDeleting
  } = useBanks();

  const [logoErrorIds, setLogoErrorIds] = useState(new Set());
  const hasLogoError = (id) => logoErrorIds.has(id);
  const markLogoError = (id) => setLogoErrorIds(prev => { const next = new Set(prev); next.add(id); return next; });

  const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false, delete: false });
  const [selectedBank, setSelectedBank] = useState(null);

  const handleModal = (type, bank = null) => {
    setIsModalOpen({ add: type === 'add', edit: type === 'edit', delete: type === 'delete' });
    setSelectedBank(bank);
  };

  const handleSubmit = async (data) => {
    try {
      if (isModalOpen.add) await create(data);
      if (isModalOpen.edit) await update({ id: selectedBank.bank_id, data });
      if (isModalOpen.delete) await deleteBankWithValidation(data);
      handleModal('close');
    } catch (err) {
      // Rethrow so child modals can display server validation (e.g., duplicate name)
      throw err;
    }
  };

  const renderLoadingOrError = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bank Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage banking partners and institutions</p>
        </div>
      </div>
      <div className="flex justify-center items-center py-12">
        {loading && <div className="text-gray-600 dark:text-gray-400">Loading banks...</div>}
        {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4 text-red-800 dark:text-red-400">{error}</div>}
      </div>
    </div>
  );

  if (loading || error) return renderLoadingOrError();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bank Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage banking partners and institutions</p>
        </div>
        <button
          onClick={() => handleModal('add')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
        >
          <BankIcon className="w-5 h-5 mr-2" />
          Add Bank
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-blue-400 dark:bg-white/[0.03]">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b border-green-200 dark:border-blue-400">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">Bank Logo</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">Bank Name</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">Description</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-center text-sm dark:text-gray-400">Added Date</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-center text-sm dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-200 dark:divide-blue-400">
              {banks.map(bank => (
                <tr key={bank.bank_id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <td className="px-4 py-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      {bank.logo && !hasLogoError(bank.bank_id) ? (
                        <img
                          src={getAssetUrl(bank.logo)}
                          alt={`${bank.bank_name} logo`}
                          className="w-6 h-6 object-contain"
                          onError={() => markLogoError(bank.bank_id)}
                        />
                      ) : (
                        <BankIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{bank.bank_name}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="max-w-xs">{bank.description ? (<p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={bank.description}>{bank.description}</p>) : (<span className="text-sm text-gray-400 dark:text-gray-500 italic">No description</span>)}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{formatDateOnly(bank.created_at)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleModal('edit', bank)}
                          className=" text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 disabled:text-gray-400 disabled:cursor-not-allowed p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                          title="Edit Bank"
                        >
                          <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleModal('delete', bank)}
                          className=" text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:text-gray-400 disabled:cursor-not-allowed p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          title="Delete Bank"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {banks.map(bank => (
          <div key={bank.bank_id} className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                  {bank.logo && !hasLogoError(bank.bank_id) ? (
                    <img
                      src={getAssetUrl(bank.logo)}
                      alt={`${bank.bank_name} logo`}
                      className="w-6 h-6 object-contain"
                      onError={() => markLogoError(bank.bank_id)}
                    />
                  ) : (
                    <BankIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">{bank.bank_name}</h3>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => handleModal('edit', bank)} className="p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200" title="Edit Bank"><PencilIcon className="w-4 h-4" /></button>
                <button onClick={() => handleModal('delete', bank)} className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200" title="Delete Bank"><TrashIcon className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="space-y-2">
              {bank.description && (<div className="text-sm"><span className="text-gray-600 dark:text-gray-400">Description</span><p className="font-medium text-gray-900 dark:text-white mt-1 text-xs leading-relaxed">{bank.description}</p></div>)}
              <div className="flex justify-between text-sm"><span className="text-gray-600 dark:text-gray-400">Added</span><span className="font-medium text-gray-900 dark:text-white">{formatDateOnly(bank.created_at)}</span></div>
            </div>
          </div>
        ))}
      </div>

      <AddBankModal isOpen={isModalOpen.add} onClose={() => handleModal('close')} onSubmit={handleSubmit} isLoading={isCreating} />
      <EditBankModal isOpen={isModalOpen.edit} onClose={() => handleModal('close')} onSubmit={handleSubmit} bank={selectedBank} isLoading={isUpdating} />
      <DeleteBankModal isOpen={isModalOpen.delete} onClose={() => handleModal('close')} onConfirm={handleSubmit} bank={selectedBank} isLoading={isDeleting} />
    </div>
  );
};

export default Banks;
