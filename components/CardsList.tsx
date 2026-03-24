export const CardsList = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
    {children}
  </div>
);
