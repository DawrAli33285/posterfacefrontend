// Add import for helper function
import { extractFace } from './initFaceDetection';

// Modify component to allow selecting specific faces
const DetectedFaces = ({ faces, onSelectFace, selectedFaceId }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
    <h3 className="font-bold mb-3 text-gray-700 flex items-center gap-2">
      <span>😊 Detected Faces 👥</span>
    </h3>
    <div className="space-y-2 overflow-y-auto max-h-[300px]">
      {faces.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No faces detected yet. Upload an image to automatically detect faces!
        </p>
      ) : (
        faces.map((face, index) => (
          <div
            key={index}
            onClick={() => onSelectFace(face)}
            className={`border-2 rounded-lg p-2 cursor-pointer transition-colors 
              ${selectedFaceId === face.id 
                ? 'border-purple-500 bg-purple-50'
                : 'border-purple-300 hover:bg-purple-50'}`}
          >
            <img
              src={face.preview}
              alt={`Face ${index + 1}`}
              className="w-full h-24 object-cover rounded mb-2"
            />
            <div className="text-xs text-center font-semibold text-gray-700">
              Face {index + 1}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default DetectedFaces