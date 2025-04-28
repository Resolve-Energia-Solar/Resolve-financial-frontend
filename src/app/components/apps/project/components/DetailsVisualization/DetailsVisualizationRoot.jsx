export default function DetailsVisualizationRoot({ children }) {
    return (
        <div style={{ padding: '16px', border: '1px solid rgba(126, 131, 136, 0.17)', boxShadow: 2, borderRadius: '8px' }}>
            {children}
        </div>
    );
}