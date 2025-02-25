local originalRequire = require

function require(modname)
    if package.loaded[modname] then
        return package.loaded[modname]
    end
    
    local possiblePaths = {
        modname .. ".lua",
        modname .. "/init.lua"
    }
    
    -- for _, path in ipairs(possiblePaths) do
    --     local success, result = pcall(function()
    --         return __load_from_zip(path)
    --     end)
        
    --     if success and result then
    --         local chunk, err = load(result, '@'..path)
    --         if not chunk then
    --             error("Erro ao carregar módulo '" .. modname .. "': " .. tostring(err))
    --         end
            
    --         local mod = chunk()
            
    --         if mod == nil then mod = true end
    --         package.loaded[modname] = mod
    --         return mod
    --     end
    -- end
    
    return originalRequire(modname)
end