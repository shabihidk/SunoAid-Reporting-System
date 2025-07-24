from flask import Blueprint, request, jsonify
from models.models import Location, db
locations_api_bp = Blueprint('locations_api', __name__)
# In locations_api_bp.py

@locations_api_bp.route('/', methods=['GET'])
@locations_api_bp.route('', methods=['GET'])
def get_locations():
    print("--- [API] /api/locations endpoint HIT ---")
    try:
        type_filter = request.args.get('type')
        parent_id = request.args.get('parent_id', type=int)
        search = request.args.get('search')
        
        print(f"[API] Filters received: type={type_filter}, parent_id={parent_id}, search={search}")
        
        # Start the query
        query = Location.query
        print("[API] Base query created: Location.query")
        
        # This is the most likely place for an error. We wrap it.
        try:
            query = query.filter(Location.is_active == True)
            print("[API] 'is_active' filter applied successfully.")
            
            if type_filter:
                query = query.filter(Location.type == type_filter)
                print(f"[API] 'type' filter ({type_filter}) applied successfully.")
            if parent_id:
                query = query.filter(Location.parent_id == parent_id)
                print(f"[API] 'parent_id' filter ({parent_id}) applied successfully.")
            if search:
                query = query.filter(Location.name.ilike(f'%{search}%'))
                print(f"[API] 'search' filter ({search}) applied successfully.")
        
        except Exception as filter_error:
            return jsonify({'error': 'CRASH DURING FILTERING', 'details': str(filter_error)}), 500

        # Order by name
        print("[API] Applying order_by and executing .all()")
        locations = query.order_by(Location.name).all()
        print(f"[API] Found {len(locations)} locations.")
        
        # Convert to dictionary
        locations_dict = [location.to_dict() for location in locations]
        print("[API] Successfully converted locations to dictionary. Sending response.")
        
        return jsonify({
            'locations': locations_dict
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500