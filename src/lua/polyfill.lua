-- load string was replaced for load on early versions
loadstring = load

table.getn = function(t)
	return #t	
end

local real_require = require
local real_print = print

require = function(name)
	real_print("[LOVE] Loading module:", name)
	return real_require(name)
end