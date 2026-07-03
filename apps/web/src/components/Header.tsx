import { Menu, ShoppingCart } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useCartStore } from '@/stores/cart.store';

export const Header = () => {
  const { toggleSidebar, toggleCart } = useUIStore();

  const items = useCartStore((state) => state.items);

  const itemCount = items.reduce(
    (acc, i) => acc + i.quantity,
    0
  );

  return (
    <header
      className="
        h-20
        px-6
        flex
        items-center
        justify-between
        bg-slate-950/70
        backdrop-blur-xl
        border-b
        border-white/10
      "
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="
            p-3
            rounded-xl
            text-slate-300
            hover:bg-white/5
            hover:text-white
            transition-all
          "
        >
          <Menu size={24} />
        </button>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Dashboard
          </h2>

          <p className="text-sm text-slate-400">
            Restaurant Operations Center
          </p>
        </div>
      </div>

      <button
        onClick={toggleCart}
        className="
          relative
          p-3
          rounded-xl
          text-slate-300
          hover:bg-white/5
          hover:text-white
          transition-all
        "
      >
        <ShoppingCart size={24} />

        {itemCount > 0 && (
          <span
            className="
              absolute
              -top-1
              -right-1
              min-w-6
              h-6
              px-1
              bg-cyan-500
              text-slate-950
              text-xs
              font-bold
              rounded-full
              flex
              items-center
              justify-center
              shadow-lg
              shadow-cyan-500/30
            "
          >
            {itemCount}
          </span>
        )}
      </button>
    </header>
  );
};