import './Shelf.css'

function Self({shelf, children}) {
    return (
        <div>
            <h1 className="name">{shelf}</h1>
            <div className="books">{children}</div>
        </div>
    )
}

export default Self;