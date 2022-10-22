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
local networkname = "zombieland_network"
local dragonfly_container = "dragonflydb"
local realtime_image = "zombieland_realtime"
local realtime_container = "zombieland_rust_container"
local prefix = ""

local function create_virtual_network()
  print("Creating zombieland-network")
  os.capture(prefix .. "docker network create " .. networkname)
end

local function create_dragonfly_container()
  print("Creating dragonflydb container")
  os.capture(prefix ..
    "docker run -d --network=" ..
    networkname .. " --ulimit memlock=-1 --name " ..
    dragonfly_container .. " docker.dragonflydb.io/dragonflydb/dragonfly")
end

local function check_os()
  if operating_system == "unix" then
    prefix = "sudo "
    print("Executing in linux ...")
  else
    print("Executing in windows ...")
  end
end

local function check_network()
  local created_networks = os.capture(prefix .. "docker network ls")
  if string.find(created_networks, networkname) ~= nil then
    print("Already created zombieland-network in docker")
  else
    create_virtual_network()
  end
end

local function check_containers()
  local created_containers = os.capture(prefix .. "docker container ls -a")
  if string.find(created_containers, dragonfly_container) then
    print("Already created dragonflydb container")
  else
    create_dragonfly_container()
  end
end

local function start_df_container()
  local dragonfly_start = os.capture(prefix .. "docker start " .. dragonfly_container)
  if string.find(dragonfly_start, dragonfly_container) then
    print("Dragonfly container executing in background...")
    return true
  else
    print("Can't start dragonfly container, stopping execution")
    return false
  end
end

local function start_rust_container()
  print("Building Rust image (This may take up a while)...")
  os.capture(prefix .. "docker build -t " .. realtime_image .. " . ")
  print("Rust container executing in background...")
  os.capture(prefix ..
    "docker run --network=" .. networkname .. " -d -it -p 8080:8080 --name=" ..
    realtime_container .. " " .. realtime_image
  )
end

local function start()
  check_os()
  check_network()
  check_containers()
  local df_start = start_df_container()
  if (df_start == false) then
    return print("Failed to start Dragonfly container")
  end
  local rust_start = start_rust_container()
  if (rust_start == false) then
    return print("Failed to start Rust container")
  end
end

start()
