from flask import Blueprint, request, jsonify
from models.models import Location, db

locations_api_bp = Blueprint('locations_api', __name__)

@locations_api_bp.route('/', methods=['GET'])
@locations_api_bp.route('', methods=['GET'])
def get_locations():
    try:
        type_filter = request.args.get('type')  # 'province', 'city', 'barangay', 'street'
        parent_id = request.args.get('parent_id', type=int)
        search = request.args.get('search')
        
        query = Location.query.filter(Location.is_active == True)
        
        if type_filter:
            query = query.filter(Location.type == type_filter)
        if parent_id:
            query = query.filter(Location.parent_id == parent_id)
        if search:
            query = query.filter(Location.name.ilike(f'%{search}%'))
        
        # Order by name
        locations = query.order_by(Location.name).all()
        
        return jsonify({
            'locations': [location.to_dict() for location in locations]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@locations_api_bp.route('/', methods=['POST'])
@locations_api_bp.route('', methods=['POST'])
def create_location():
    try:
        data = request.get_json()
        
        required_fields = ['name', 'type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        location = Location(
            name=data['name'],
            type=data['type'],
            parent_id=data.get('parent_id'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            postal_code=data.get('postal_code'),
            population=data.get('population'),
            area_km2=data.get('area_km2'),
            description=data.get('description')
        )
        
        db.session.add(location)
        db.session.commit()
        
        return jsonify({
            'message': 'Location created successfully',
            'location': location.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@locations_api_bp.route('/provinces', methods=['GET'])
def get_provinces():
    try:
        provinces = db.session.query(Location.province).distinct().all()
        province_list = [province[0] for province in provinces]
        
        return jsonify({
            'provinces': province_list
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@locations_api_bp.route('/cities', methods=['GET'])
def get_cities():
    try:
        province = request.args.get('province')
        
        query = db.session.query(Location.city)
        if province:
            query = query.filter(Location.province == province)
        
        cities = query.distinct().all()
        city_list = [city[0] for city in cities]
        
        return jsonify({
            'cities': city_list
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
