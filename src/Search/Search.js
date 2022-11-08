import './Search.css'

function Search({children, onFilter, onReturn}) {
    const filter = (event) => {
        onFilter(event.target.value)
    };
    return(
        <div>
            <div className="header">
                <button className="return-button" onClick={() => onReturn()}>⬅</button>
                <input className="search-input" onChange={filter}></input>
            </div>
            <div className="chidren">{children}</div>
        </div>
    )
}

export default Search;