import React, { useState } from 'react';

const RestaurantBooking = () => {
  const [selectedTable, setSelectedTable] = useState({
    id: null,
    capacity: null,
    isAvailable: false
  });

  const [showModal, setShowModal] = useState(false);

  // Table data
  const tables = [
    { id: "B1", capacity: 10, shape: "square", position: { top: 50, left: 50 }, isAvailable: true },
    { id: "B2", capacity: 10, shape: "square", position: { top: 50, left: 250 }, isAvailable: true },
    { id: "B3", capacity: 10, shape: "square", position: { top: 50, left: 450 }, isAvailable: true },
    { id: "B4", capacity: 6, shape: "round", position: { top: 230, left: 50 }, isAvailable: false },
    { id: "B5", capacity: 6, shape: "round", position: { top: 230, left: 250 }, isAvailable: false },
    { id: "B6", capacity: 6, shape: "round", position: { top: 230, left: 450 }, isAvailable: false },
    { id: "A4", capacity: 10, shape: "square", position: { top: 410, left: 50 }, isAvailable: true },
    { id: "A3", capacity: 6, shape: "round", position: { top: 410, left: 250 }, isAvailable: true },
    { id: "A2", capacity: 6, shape: "round", position: { top: 410, left: 450 }, isAvailable: true },
    { id: "A1", capacity: 6, shape: "round", position: { top: 410, left: 620 }, isAvailable: true },
  ];

  const handleTableClick = (table) => {
    setSelectedTable({
      id: table.id,
      capacity: table.isAvailable ? table.capacity : null,
      isAvailable: table.isAvailable
    });
  };

  // Square table chair positions
  const getSquareTableChairPosition = (index) => {
    const positions = [
      { top: '-30px', left: '5px' }, // Top left
      { top: '-30px', left: '50px' }, // Top middle
      { top: '-5px', right: '-30px' }, // Right top
      { top: '28px', right: '-30px' }, // Right middle
      { top: '63px', right: '-30px' }, // Right bottom
      { bottom: '-30px', left: '5px' }, // Bottom left
      { bottom: '-30px', left: '50px' }, // Bottom middle
      { top: '-5px', left: '-30px' }, // Left top
      { top: '28px', left: '-30px' }, // Left middle
      { top: '63px', left: '-30px' } // Left bottom
    ];
    return positions[index - 1] || {};
  };

  // Round table chair positions
  const getRoundTableChairPosition = (index) => {
    const positions = [
      { top: '-28px', left: '28px' }, // Top
      { top: '8px', right: '-25px' }, // Upper right
      { top: '48px', right: '-25px' }, // Lower right
      { bottom: '-28px', left: '28px' }, // Bottom
      { top: '48px', left: '-25px' }, // Lower left
      { top: '8px', left: '-25px' } // Upper left
    ];
    return positions[index - 1] || {};
  };

  // Generate chair numbers based on table shape
  const renderChairNumbers = (shape, capacity) => {
    return Array.from({ length: capacity }, (_, i) => (
      <span 
        key={i + 1} 
        className="table-number"
        style={{
          position: 'absolute',
          width: '24px',
          height: '24px',
          lineHeight: '24px',
          textAlign: 'center',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          fontSize: '0.7em',
          fontWeight: 'normal',
          ...(shape === 'square' 
            ? getSquareTableChairPosition(i + 1) 
            : getRoundTableChairPosition(i + 1))
        }}
      >
        {i + 1}
      </span>
    ));
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Restaurant Table Booking</h1>
      <button 
        className="btn btn-primary"
        onClick={() => setShowModal(true)}
      >
        View Restaurant Layout & Book
      </button>

      {/* Modal */}
      {showModal && <div className="modal-backdrop fade show" style={{ opacity: 0.5 }}></div>}

      <div className={`modal fade ${showModal ? 'show' : ''}`} 
           style={{ display: showModal ? 'block' : 'none' }}
           tabIndex="-1" 
           role="dialog" 
           aria-labelledby="tableModalLabel" 
           aria-hidden="true">
        <div className="modal-dialog" style={{ maxWidth: '800px' }}>
        <div className="modal-content" style={{ minHeight: '520px', position: 'relative' }}>
  <div className="modal-header">
    <h5 className="modal-title" id="tableModalLabel">Restaurant Layout</h5>
    <button 
      type="button" 
      className="close" 
      onClick={() => setShowModal(false)}
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div className="modal-body" style={{ overflow: 'visible', padding: '20px' }}>
    <div 
      className="restaurant-container" 
      style={{
        width: '750px',
        height: '550px',
        border: '2px solid #333',
        padding: '20px',
        position: 'relative',
        backgroundColor: '#f8f9fa',
        margin: '0 auto'
      }}
    >
      {tables.map((table) => (
        <div 
          key={table.id}
          className={`table table-${table.shape} ${table.isAvailable ? 'available' : 'booked'}`}
          onClick={() => handleTableClick(table)}
          style={{
            position: 'absolute',
            top: `${table.position.top}px`,
            left: `${table.position.left}px`,
            width: '80px',
            height: '80px',
            borderRadius: table.shape === 'round' ? '50%' : '0',
            border: '1px solid #000',
            padding: '5px',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            backgroundColor: table.isAvailable ? '#ffe0b2' : '#2E8B57',
            color: table.isAvailable ? 'black' : 'white',
            boxShadow: selectedTable.id === table.id ? '0 0 10px rgba(0,0,0,0.5)' : 'none'
          }}
        >
          {table.id}
          {renderChairNumbers(table.shape, table.capacity)}
        </div>
      ))}
    </div>
  </div>
  <div className="modal-footer">
  <div className="container-fluid">
    <div className="row">
      <div className="col-md-6">
        <div id="selectedTableInfo" style={{ fontWeight: 'bold', marginTop: '10px' }}>
          Selected table:{' '}
          <span>
            {selectedTable.id
              ? selectedTable.isAvailable
                ? `${selectedTable.id} (Capacity: ${selectedTable.capacity})`
                : `Table ${selectedTable.id} is already booked`
              : 'None'}
          </span>
        </div>
      </div>
      <div className="col-md-6 text-right d-flex gap-2">
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={() => setShowModal(false)}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!selectedTable.isAvailable}
        >
          Book Table
        </button>
      </div>
    </div>
  </div>
</div>

</div>

        </div>
      </div>
    </div>
  );
};

export default RestaurantBooking;
