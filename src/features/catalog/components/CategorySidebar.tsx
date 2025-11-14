// FILE: src/features/catalog/components/CategorySidebar.tsx
import { memo } from 'react'
import { Search, Grid } from 'lucide-react'

interface Props {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
  search: string
  onSearch: (term: string) => void
}

export default memo(function CategorySidebar({ categories, selected, onSelect, search, onSearch }: Props) {
  return (
    <aside className="sticky top-28 h-fit space-y-6">
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Grid className="text-primary" size={20} />
          <h3 className="font-title font-bold text-lg text-dark">Categorias</h3>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => onSelect('Todos')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              selected === 'Todos'
                ? 'bg-primary text-white shadow-md'
                : 'hover:bg-gray-50 text-gray-700 hover:pl-5'
            }`}
          >
            Todos os produtos
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                selected === cat
                  ? 'bg-primary text-white shadow-md'
                  : 'hover:bg-gray-50 text-gray-700 hover:pl-5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
})