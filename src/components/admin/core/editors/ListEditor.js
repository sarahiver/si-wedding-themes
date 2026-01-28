// core/editors/ListEditor.js - Reusable List Editor Logic
import React from 'react';

/**
 * Generic List Editor - handles any array-based content
 * @param {Object} props
 * @param {Object} props.components - Styled components (C)
 * @param {Array} props.items - Array of items
 * @param {Function} props.onItemsChange - Callback when items change
 * @param {Function} props.renderItem - Render function for each item
 * @param {Function} props.createNewItem - Factory function for new items
 * @param {string} props.addLabel - Label for add button
 */
function ListEditor({ 
  components: C, 
  items = [], 
  onItemsChange, 
  renderItem, 
  createNewItem, 
  addLabel = '+ Hinzufügen' 
}) {
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onItemsChange(newItems);
  };

  const removeItem = (index) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onItemsChange([...items, createNewItem()]);
  };

  const moveItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onItemsChange(newItems);
  };

  return (
    <>
      {items.map((item, index) => (
        <C.ItemCard key={index}>
          <C.ItemHeader>
            <C.ItemNumber>#{index + 1}</C.ItemNumber>
            <C.ItemActions>
              {index > 0 && (
                <C.SmallButton onClick={() => moveItem(index, -1)} title="Nach oben">↑</C.SmallButton>
              )}
              {index < items.length - 1 && (
                <C.SmallButton onClick={() => moveItem(index, 1)} title="Nach unten">↓</C.SmallButton>
              )}
              <C.SmallButton $variant="danger" onClick={() => removeItem(index)}>×</C.SmallButton>
            </C.ItemActions>
          </C.ItemHeader>
          {renderItem(item, index, (field, value) => updateItem(index, field, value))}
        </C.ItemCard>
      ))}
      <C.SmallButton onClick={addItem} style={{ marginBottom: '1.5rem' }}>
        {addLabel}
      </C.SmallButton>
    </>
  );
}

export default ListEditor;
