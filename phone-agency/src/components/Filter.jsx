const Filter = ({ searchTerm, handleSearch }) => {
    return (
      <>
        filter shown with <input value={searchTerm} onChange={handleSearch} />
      </>
    );
  };
  
  export default Filter;
  