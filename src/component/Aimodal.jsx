import React from 'react'
import "../styles/modal.scss"

const Aimodal = ({ show, onClose, onAnalyze, solutions, loading, analysis }) => {
    
    React.useEffect(() => {
        if (show && !loading && onAnalyze) {
            // Auto-trigger analysis when modal opens
            onAnalyze()
        }
    }, [show, loading, onAnalyze])
    
    if (!show) return null
    
    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <h4>🪄 AI Troubleshooting</h4>
                <div className="modal-content">
                    {loading ? (
                        <div className="loading-state">
                            <p>Analyzing your issue with AI...</p>
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : analysis ? (
                        <div className="analysis-result">
                            <div className="mb-3">
                                <h6>Category: <span className="badge bg-info">{analysis.category}</span></h6>
                                <h6>Priority: <span className={`badge bg-${analysis.priority.toLowerCase() === 'high' ? 'danger' : analysis.priority.toLowerCase() === 'medium' ? 'warning' : 'success'}`}>{analysis.priority}</span></h6>
                            </div>
                            <div>
                                <p className="fw-bold">Suggested Resolution Steps:</p>
                                {analysis.solution && analysis.solution.length > 0 ? (
                                    <ul className="solution-list">
                                        {analysis.solution.map((sol, idx) => (
                                            <li key={idx}>{sol}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No specific steps available.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted">Unable to analyze. Please try again.</p>
                    )}
                </div>
                <div className="d-flex gap-2 mt-3">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default Aimodal