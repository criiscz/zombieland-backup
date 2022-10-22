function os.capture(cmd, raw)
  local f = assert(io.popen(cmd, 'r'))
  local s = assert(f:read('*a'))
  f:close()
  if raw then return s end
  s = string.gsub(s, '^%s+', '')
  s = string.gsub(s, '%s+$', '')
  s = string.gsub(s, '[\n\r]+', ' ')
  return s
end

function OS()
  return package.config:sub(1, 1) == "\\" and "win" or "unix"
end

-- Start of script

local operating_system = OS()
local networkname = "zombieland-network"
local container_df_name = "dragonflydb"
local prefix = ""

local function create_virtual_network()
  print("Creating zombieland-network")
  os.capture(prefix .. "docker network create " .. networkname)
end

local function create_dragonfly_container()
  print("Creating dragonflydb container")
  os.capture(prefix ..
    "docker run --network=" ..
    networkname .. " --ulimit memlock=-1 --name " ..
    container_df_name .. "docker.dragonflydb.io/dragonflydb/dragonfly")
end

local function check_os()
  if (operating_system == "unix") then
    prefix = "sudo "
    print("Executing in linux ...")
  else
    print("Executing in windows ...")
  end
end

local function check_network()
  local created_networks = os.capture(prefix .. "docker network ls")
  if (string.find(created_networks, networkname)) then
    print("Already created zombieland-network in docker")
  else
    create_virtual_network()
  end
end

local function check_containers()
  local created_containers = os.capture(prefix .. "docker container ls -a")
  if (string.find(created_containers, container_df_name)) then
    print("Already created dragonflydb container")
  else
    create_dragonfly_container()
  end
end

local function start_df_container()
  local dragonfly_start = os.capture(prefix .. "docker start " .. container_df_name)
  if (string.find(dragonfly_start, container_df_name)) then
    print("Dragonfly container executing...")
    return true
  else
    print("Can't start dragonfly container, stopping execution")
    return false
  end
end

local function start_rust_container()
end

local function start()
  check_os()
  check_network()
  check_containers()
  local df_start = start_df_container()
  local rust_start = start_rust_container()
end

start()
