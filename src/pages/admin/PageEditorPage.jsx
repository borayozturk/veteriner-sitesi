import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaSave, FaTimes, FaFile, FaSearch, FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import api from '../../services/api';
import RichTextEditor from '../../components/common/RichTextEditor';

const PageEditorPage = () => {
  const [searchParams] = useSearchParams();
  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    page_name: '',
    title: '',
    content: '',
    sections: [],
    faqs: [],
    features: [],
    process_steps: [],
    vaccination_schedule: { puppies: '', adult: '', rabies: '' }
  });

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    filterPages();
  }, [searchTerm, pages]);

  // Check if there's a page parameter in URL and auto-open that page
  useEffect(() => {
    const pageSlug = searchParams.get('page');
    if (pageSlug && pages.length > 0 && !showModal) {
      const pageToEdit = pages.find(p => p.page_name === pageSlug);
      if (pageToEdit) {
        handleOpenModal(pageToEdit);
      }
    }
  }, [searchParams, pages]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/pages/', {
        headers: {
          'Accept': 'application/json; charset=utf-8',
        },
      });

      // Get text first to see raw response
      const text = await response.text();
      const data = JSON.parse(text);

      // Since pagination is disabled, data is directly an array, not {results: [...]}
      setPages(Array.isArray(data) ? data : (data.results || []));
      setLoading(false);
    } catch (error) {
      console.error('Sayfalar yüklenemedi:', error);
      setLoading(false);
    }
  };

  const filterPages = () => {
    if (!Array.isArray(pages)) {
      setFilteredPages([]);
      return;
    }

    let filtered = pages;

    if (searchTerm && searchTerm.trim() !== '') {
      filtered = filtered.filter(page => {
        const pageName = page.page_name || '';
        const title = page.title || '';
        const search = searchTerm.toLowerCase();
        return pageName.toLowerCase().includes(search) ||
               title.toLowerCase().includes(search);
      });
    }

    setFilteredPages(filtered);
  };

  const handleOpenModal = (page = null) => {
    if (page) {
      setEditingPage(page);
      const pageSections = Array.isArray(page.sections) ? page.sections : [];
      const pageFaqs = Array.isArray(page.faqs) ? page.faqs : [];
      const pageFeatures = Array.isArray(page.features) ? page.features : [];
      const pageProcessSteps = Array.isArray(page.process_steps) ? page.process_steps : [];
      const pageVaccinationSchedule = page.vaccination_schedule || { puppies: '', adult: '', rabies: '' };
      setFormData({
        page_name: page.page_name || '',
        title: page.title || '',
        content: page.content || '',
        sections: pageSections,
        faqs: pageFaqs,
        features: pageFeatures,
        process_steps: pageProcessSteps,
        vaccination_schedule: pageVaccinationSchedule
      });
    } else {
      setEditingPage(null);
      setFormData({
        page_name: '',
        title: '',
        content: '',
        sections: [],
        faqs: [],
        features: [],
        process_steps: [],
        vaccination_schedule: { puppies: '', adult: '', rabies: '' }
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPage(null);
    setFormData({
      page_name: '',
      title: '',
      content: '',
      sections: [],
      faqs: [],
      features: [],
      process_steps: [],
      vaccination_schedule: { puppies: '', adult: '', rabies: '' }
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.page_name || !formData.title) {
        alert('Sayfa adı ve başlık zorunludur.');
        return;
      }

      const pageData = {
        page_name: formData.page_name,
        title: formData.title,
        content: formData.content,
        sections: formData.sections,
        faqs: formData.faqs,
        features: formData.features,
        process_steps: formData.process_steps,
        vaccination_schedule: formData.vaccination_schedule
      };

      if (editingPage) {
        await fetch(`http://localhost:8000/api/pages/${editingPage.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(pageData),
        });
        alert('Sayfa başarıyla güncellendi!');
      } else {
        await fetch('http://localhost:8000/api/pages/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(pageData),
        });
        alert('Sayfa başarıyla oluşturuldu!');
      }

      handleCloseModal();
      fetchPages();
    } catch (error) {
      console.error('Sayfa kaydedilemedi:', error);
      alert('Sayfa kaydedilirken bir hata oluştu.');
    }
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          id: Date.now(),
          type: 'text',
          title: '',
          content: '',
          items: []
        }
      ]
    });
  };

  const updateSection = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index] = {
      ...newSections[index],
      [field]: value
    };
    setFormData({ ...formData, sections: newSections });
  };

  const deleteSection = (index) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;
    const newSections = [...formData.sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setFormData({ ...formData, sections: newSections });
  };

  const moveSectionDown = (index) => {
    if (index === formData.sections.length - 1) return;
    const newSections = [...formData.sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    setFormData({ ...formData, sections: newSections });
  };

  const addItem = (sectionIndex) => {
    const newSections = [...formData.sections];
    if (!newSections[sectionIndex].items) {
      newSections[sectionIndex].items = [];
    }
    newSections[sectionIndex].items.push('');
    setFormData({ ...formData, sections: newSections });
  };

  const updateItem = (sectionIndex, itemIndex, value) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].items[itemIndex] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const deleteItem = (sectionIndex, itemIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].items = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
    setFormData({ ...formData, sections: newSections });
  };

  // FAQ Management Functions
  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [
        ...formData.faqs,
        {
          id: Date.now(),
          question: '',
          answer: ''
        }
      ]
    });
  };

  const updateFaq = (index, field, value) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index] = {
      ...newFaqs[index],
      [field]: value
    };
    setFormData({ ...formData, faqs: newFaqs });
  };

  const deleteFaq = (index) => {
    const newFaqs = formData.faqs.filter((_, i) => i !== index);
    setFormData({ ...formData, faqs: newFaqs });
  };

  const moveFaqUp = (index) => {
    if (index === 0) return;
    const newFaqs = [...formData.faqs];
    [newFaqs[index - 1], newFaqs[index]] = [newFaqs[index], newFaqs[index - 1]];
    setFormData({ ...formData, faqs: newFaqs });
  };

  const moveFaqDown = (index) => {
    if (index === formData.faqs.length - 1) return;
    const newFaqs = [...formData.faqs];
    [newFaqs[index], newFaqs[index + 1]] = [newFaqs[index + 1], newFaqs[index]];
    setFormData({ ...formData, faqs: newFaqs });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Sayfa Düzenle</h1>
        <p className="text-purple-100">Statik sayfaların içeriğini bölüm bölüm düzenleyin</p>
      </motion.div>

      {/* Search and Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Sayfa ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
          >
            <FaFile />
            Yeni Sayfa
          </button>
        </div>
      </motion.div>

      {/* Pages List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6"
      >
        {filteredPages.length > 0 ? (
          filteredPages.map((page, index) => (
            <motion.div
              key={page.page_name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs font-bold rounded-full">
                        {page.page_name}
                      </span>
                      {page.sections && page.sections.length > 0 && (
                        <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">
                          {page.sections.length} Bölüm
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {page.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {page.content ? page.content.substring(0, 200) + '...' : 'İçerik yok'}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Son güncelleme: {new Date(page.updated_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(page)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <FaEdit size={14} />
                      Düzenle
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20">
            <FaFile className="text-5xl mx-auto mb-3 opacity-30 text-gray-500" />
            <p className="font-medium text-gray-500">Sayfa bulunamadı</p>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-7xl w-full my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
                <h3 className="text-2xl font-bold text-white">
                  {editingPage ? 'Sayfayı Düzenle' : 'Yeni Sayfa Oluştur'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="text-white text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[75vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Page Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Sayfa Adı (Slug) *
                    </label>
                    <input
                      type="text"
                      value={formData.page_name}
                      onChange={(e) => setFormData({ ...formData, page_name: e.target.value })}
                      disabled={editingPage !== null}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none disabled:bg-gray-100"
                      placeholder="yurtdisi-cikis"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editingPage ? 'Sayfa adı değiştirilemez' : 'URL\'de görünecek benzersiz isim'}
                    </p>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Ana Başlık *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                      placeholder="Yurtdışı Çıkış İşlemleri"
                    />
                  </div>

                  {/* Short Description/Content */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Kısa Açıklama
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                      rows="3"
                      placeholder="Sayfanın kısa açıklaması..."
                    />
                  </div>

                  <hr className="my-8 border-gray-200" />

                  {/* Sections */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-900">Sayfa Bölümleri</h4>
                      <button
                        onClick={addSection}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <FaPlus />
                        Bölüm Ekle
                      </button>
                    </div>

                    <div className="space-y-6">
                      {Array.isArray(formData.sections) && formData.sections.map((section, sectionIndex) => (
                        <div key={section.id || sectionIndex} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                          {/* Section Header */}
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-gray-900">
                              Bölüm {sectionIndex + 1}
                            </h5>
                            <div className="flex gap-2">
                              <button
                                onClick={() => moveSectionUp(sectionIndex)}
                                disabled={sectionIndex === 0}
                                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Yukarı taşı"
                              >
                                <FaArrowUp size={14} />
                              </button>
                              <button
                                onClick={() => moveSectionDown(sectionIndex)}
                                disabled={sectionIndex === formData.sections.length - 1}
                                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Aşağı taşı"
                              >
                                <FaArrowDown size={14} />
                              </button>
                              <button
                                onClick={() => deleteSection(sectionIndex)}
                                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                title="Sil"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Section Type */}
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Bölüm Tipi
                            </label>
                            <select
                              value={section.type}
                              onChange={(e) => updateSection(sectionIndex, 'type', e.target.value)}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                            >
                              <option value="text">Metin İçerik</option>
                              <option value="list">Liste (Özellikler/Süreç)</option>
                              <option value="both">Metin + Liste</option>
                            </select>
                          </div>

                          {/* Section Title */}
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Bölüm Başlığı
                            </label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                              placeholder="Hizmet Hakkında, Neler Sunuyoruz, Süreç..."
                            />
                          </div>

                          {/* Section Content (for text and both types) */}
                          {(section.type === 'text' || section.type === 'both') && (
                            <div className="mb-4">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                İçerik
                              </label>
                              <RichTextEditor
                                content={section.content || ''}
                                onChange={(html) => updateSection(sectionIndex, 'content', html)}
                              />
                            </div>
                          )}

                          {/* Section Items (for list and both types) */}
                          {(section.type === 'list' || section.type === 'both') && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                  Liste Öğeleri
                                </label>
                                <button
                                  onClick={() => addItem(sectionIndex)}
                                  className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition-colors text-sm"
                                >
                                  <FaPlus size={10} />
                                  Öğe Ekle
                                </button>
                              </div>
                              <div className="space-y-2">
                                {section.items && section.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={item}
                                      onChange={(e) => updateItem(sectionIndex, itemIndex, e.target.value)}
                                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                                      placeholder={`Öğe ${itemIndex + 1}`}
                                    />
                                    <button
                                      onClick={() => deleteItem(sectionIndex, itemIndex)}
                                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                      <FaTrash size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {(!formData.sections || formData.sections.length === 0) && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                          <p className="text-gray-500 mb-4">Henüz bölüm eklenmemiş</p>
                          <button
                            onClick={addSection}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <FaPlus />
                            İlk Bölümü Ekle
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <hr className="my-8 border-gray-200" />

                  {/* FAQs Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-900">SSS (Sıkça Sorulan Sorular)</h4>
                      <button
                        onClick={addFaq}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FaPlus />
                        Soru Ekle
                      </button>
                    </div>

                    <div className="space-y-4">
                      {Array.isArray(formData.faqs) && formData.faqs.map((faq, faqIndex) => (
                        <div key={faq.id || faqIndex} className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                          {/* FAQ Header */}
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-gray-900">
                              Soru {faqIndex + 1}
                            </h5>
                            <div className="flex gap-2">
                              <button
                                onClick={() => moveFaqUp(faqIndex)}
                                disabled={faqIndex === 0}
                                className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Yukarı taşı"
                              >
                                <FaArrowUp size={14} />
                              </button>
                              <button
                                onClick={() => moveFaqDown(faqIndex)}
                                disabled={faqIndex === formData.faqs.length - 1}
                                className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Aşağı taşı"
                              >
                                <FaArrowDown size={14} />
                              </button>
                              <button
                                onClick={() => deleteFaq(faqIndex)}
                                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                title="Sil"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Question */}
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Soru
                            </label>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => updateFaq(faqIndex, 'question', e.target.value)}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                              placeholder="Örn: Aşı randevusu için ne kadar önceden haber vermem gerekir?"
                            />
                          </div>

                          {/* Answer */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Cevap
                            </label>
                            <textarea
                              value={faq.answer}
                              onChange={(e) => updateFaq(faqIndex, 'answer', e.target.value)}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                              rows="4"
                              placeholder="Sorunun detaylı cevabını buraya yazın..."
                            />
                          </div>
                        </div>
                      ))}

                      {(!formData.faqs || formData.faqs.length === 0) && (
                        <div className="text-center py-12 bg-blue-50 rounded-xl border-2 border-dashed border-blue-300">
                          <p className="text-gray-500 mb-4">Henüz soru eklenmemiş</p>
                          <button
                            onClick={addFaq}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <FaPlus />
                            İlk Soruyu Ekle
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <hr className="my-8 border-gray-200" />

                  {/* Features Section - Neler Sunuyoruz */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-900">✨ Neler Sunuyoruz (Özellikler)</h4>
                      <button
                        onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <FaPlus />
                        Özellik Ekle
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.features && formData.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...formData.features];
                              newFeatures[index] = e.target.value;
                              setFormData({ ...formData, features: newFeatures });
                            }}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                            placeholder={`Özellik ${index + 1}`}
                          />
                          <button
                            onClick={() => {
                              const newFeatures = formData.features.filter((_, i) => i !== index);
                              setFormData({ ...formData, features: newFeatures });
                            }}
                            className="p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}

                      {(!formData.features || formData.features.length === 0) && (
                        <div className="text-center py-12 bg-green-50 rounded-xl border-2 border-dashed border-green-300">
                          <p className="text-gray-500 mb-4">Henüz özellik eklenmemiş (isteğe bağlı)</p>
                          <button
                            onClick={() => setFormData({ ...formData, features: [''] })}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <FaPlus />
                            İlk Özelliği Ekle
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <hr className="my-8 border-gray-200" />

                  {/* Process Steps - Süreç Nasıl İşler */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-900">🔄 Süreç Nasıl İşler (Adımlar)</h4>
                      <button
                        onClick={() => setFormData({ ...formData, process_steps: [...formData.process_steps, ''] })}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors"
                      >
                        <FaPlus />
                        Adım Ekle
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.process_steps && formData.process_steps.map((step, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <input
                            type="text"
                            value={step}
                            onChange={(e) => {
                              const newSteps = [...formData.process_steps];
                              newSteps[index] = e.target.value;
                              setFormData({ ...formData, process_steps: newSteps });
                            }}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                            placeholder={`Adım ${index + 1} açıklaması`}
                          />
                          <button
                            onClick={() => {
                              const newSteps = formData.process_steps.filter((_, i) => i !== index);
                              setFormData({ ...formData, process_steps: newSteps });
                            }}
                            className="p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}

                      {(!formData.process_steps || formData.process_steps.length === 0) && (
                        <div className="text-center py-12 bg-indigo-50 rounded-xl border-2 border-dashed border-indigo-300">
                          <p className="text-gray-500 mb-4">Henüz adım eklenmemiş (isteğe bağlı)</p>
                          <button
                            onClick={() => setFormData({ ...formData, process_steps: [''] })}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            <FaPlus />
                            İlk Adımı Ekle
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vaccination Schedule - Aşı Takvimi (Only for asilama page) */}
                  {formData.page_name === 'asilama' && (
                    <>
                      <hr className="my-8 border-gray-200" />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-4">📅 Aşı Takvimi (Aşılama sayfası için)</h4>
                        <div className="space-y-4">
                          <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              🐾 Yavru Hayvanlar
                            </label>
                            <textarea
                              value={formData.vaccination_schedule.puppies || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                vaccination_schedule: { ...formData.vaccination_schedule, puppies: e.target.value }
                              })}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all outline-none resize-none"
                              rows="3"
                              placeholder="Yavru hayvanlar için aşı takvimi bilgisi..."
                            />
                          </div>

                          <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              🦴 Yetişkin Hayvanlar
                            </label>
                            <textarea
                              value={formData.vaccination_schedule.adult || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                vaccination_schedule: { ...formData.vaccination_schedule, adult: e.target.value }
                              })}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none resize-none"
                              rows="3"
                              placeholder="Yetişkin hayvanlar için aşı takvimi bilgisi..."
                            />
                          </div>

                          <div className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              💉 Kuduz Aşısı
                            </label>
                            <textarea
                              value={formData.vaccination_schedule.rabies || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                vaccination_schedule: { ...formData.vaccination_schedule, rabies: e.target.value }
                              })}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all outline-none resize-none"
                              rows="3"
                              placeholder="Kuduz aşısı için bilgi..."
                            />
                          </div>

                          <p className="text-sm text-gray-500 italic">
                            * Aşı takvimi alanları boş bırakılırsa sayfada gözükmez
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3 justify-end sticky bottom-0 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  <FaSave />
                  {editingPage ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageEditorPage;
