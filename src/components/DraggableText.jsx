import Draggable from "react-draggable";

// Text có thể kéo và sửa nội dung trực tiếp
function DraggableText({ text, onTextChange, position, onPositionChange, style }) {
  return (
    <Draggable
      position={position}
      onStop={(_, data) => onPositionChange({ x: data.x, y: data.y })}
      cancel='[contenteditable="true"]'   // cho phép bôi đen/sửa chữ mà không kéo
    >
      <div
        className="draggable-text"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onTextChange(e.currentTarget.textContent || "")}
        style={style}
      >
        {text}
      </div>
    </Draggable>
  );
}
