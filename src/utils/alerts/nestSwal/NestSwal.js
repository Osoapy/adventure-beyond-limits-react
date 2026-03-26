const NestSwal = ({ title, text, onClose }) => {
    return (
        <div
            style={
                {
                    display: "flex", 
                    position: "absolute", 
                    zIndex: "10", 
                    width:"100%", 
                    height:"100vh",
                    backgroundColor:"rgba(0,0,0,0.4)",
                    justifyContent:"center",
                    alignItems:"center",
                    position:"fixed",
                    top:"0px",
                    left:"0px",
                }
            }
            onClick={() => onClose()}
        >
            <div
                aria-labelledby="swal2-title"
                aria-describedby="swal2-html-container"
                className="swal2-popup swal2-modal swal2-icon-warning swal2-show"
                tabIndex={-1}
                role="dialog"
                aria-live="assertive"
                aria-modal="true"
                style={{ display: "grid", position: "relative", zIndex: "11" }}
            >

                <div
                    className="swal2-icon swal2-warning swal2-icon-show"
                    style={{ display: "flex" }}
                >
                    <div className="swal2-icon-content">!</div>
                </div>

                <h2
                    className="swal2-title"
                    id="swal2-title"
                    style={{ display: "block" }}
                >
                    {title}
                </h2>

                <div
                    className="swal2-html-container"
                    id="swal2-html-container"
                    style={{ display: "block" }}
                >
                    {text}
                </div>

                <div className="swal2-actions" style={{ display: "flex" }}>
                    <div className="swal2-loader"></div>

                    <button
                        type="button"
                        className="swal2-confirm swal2-styled"
                        style={{
                            display: "inline-block",
                            "--swal2-action-button-focus-box-shadow":
                                "0 0 0 3px rgba(112, 102, 224, 0.5)",
                        }}
                        onClick={() => onClose()}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NestSwal