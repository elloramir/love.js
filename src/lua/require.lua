local originalRequire = require

function require(modname)
    if package.loaded[modname] then
        return package.loaded[modname]
    end

    local dir = modname:gsub("[.]", "/")

    local possiblePaths = {
        dir .. ".lua",
        dir .. "/init.lua"
    }

    for _, path in ipairs(possiblePaths) do
        local result = __getScript(path)
        local success = result ~= nil
        
        if success and result then
            local chunk, err = load(result, '@'..path)
            if not chunk then
                error("Erro ao carregar módulo '" .. modname .. "': " .. tostring(err))
            end
            
            local mod = chunk()
            
            if mod == nil then mod = true end
            package.loaded[modname] = mod
            return mod
        end
    end
    
    return originalRequire(modname)
end