# Blender Python script for Luna model
import bpy

def create_luna_model():
    # Clear existing objects
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    
    # Create base mesh
    bpy.ops.mesh.primitive_plane_add(size=2)
    base = bpy.context.active_object
    
    # Add subdivision surface modifier
    subsurf = base.modifiers.new(name="Subsurf", type='SUBSURF')
    subsurf.levels = 3
    
    # Add clothing mesh
    bpy.ops.mesh.primitive_cube_add()
    dress = bpy.context.active_object
    
    # Add hair system
    bpy.ops.mesh.primitive_plane_add()
    hair = bpy.context.active_object
    hair_system = hair.modifiers.new(name="Hair", type='PARTICLE_SYSTEM')
    hair_settings = hair_system.particle_system.settings
    hair_settings.type = 'HAIR'
    hair_settings.count = 10000
    
    # Materials
    # Create materials for skin, dress, and hair
    skin_mat = bpy.data.materials.new(name="Skin")
    skin_mat.use_nodes = True
    nodes = skin_mat.node_tree.nodes
    nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.95, 0.91, 0.89, 1)
    
    dress_mat = bpy.data.materials.new(name="Dress")
    dress_mat.use_nodes = True
    nodes = dress_mat.node_tree.nodes
    nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.02, 0.02, 0.02, 1)
    
    hair_mat = bpy.data.materials.new(name="Hair")
    hair_mat.use_nodes = True
    nodes = hair_mat.node_tree.nodes
    nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.95, 0.95, 0.98, 1)

# Run the script
create_luna_model() 