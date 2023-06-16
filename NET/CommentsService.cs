using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class CommentsService : ICommentsService
    {
        IDataProvider _data = null;
        private IUserService _userService;

        public CommentsService(IDataProvider data, IUserService userService)
        {
            _data = data;
            _userService = userService;
        }

        public void DeleteComments(int id)
        {
            string procName = "[dbo].[Comments_Delete]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, null);
        }
        public void UpdateComments(CommentsUpdateRequest model)
        {
            string procName = "[dbo].[Comments_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                
                col.AddWithValue("@Id", model.Id);
            },
            returnParameters: null);
        }
        public int AddComments(CommentsAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Comments_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@CreatedBy", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out id);
            });
            return id;
            
        }

        

        public List<Comment> GetByEntityTypeId(int entityId, int entityTypeId)
        {
            string procName = "[dbo].[Comments_Select_ByEntityId]";
            List<Comment> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@EntityId", entityId);
                paramCollection.AddWithValue("@EntityTypeId", entityTypeId);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Comment comment = MapSingleComment(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<Comment>();
                }

                list.Add(comment);
            });

            return list;
        }

        private static void AddCommonParams(CommentsAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Subject", model.Subject);
            col.AddWithValue("@Text", model.Text);
            col.AddWithValue("@ParentId", model.ParentId);
            col.AddWithValue("@EntityTypeId", model.EntityTypeId);
            col.AddWithValue("@EntityId", model.EntityId);
        }

        public Comment MapSingleComment(IDataReader reader, ref int startingIndex)
        {
            Comment comments = new Comment();

            comments.Id = reader.GetSafeInt32(startingIndex++);
            comments.Subject = reader.GetSafeString(startingIndex++);
            comments.Text = reader.GetSafeString(startingIndex++);
            comments.ParentId = reader.GetSafeInt32(startingIndex++);
            comments.EntityTypeId = reader.GetSafeInt32(startingIndex++);
            comments.EntityId = reader.GetSafeInt32(startingIndex++);
            comments.IsDeleted = reader.GetSafeBool(startingIndex++);
            comments.CreatedBy = _userService.MapBaseUser(reader, ref startingIndex);
            comments.DateCreated = reader.GetSafeDateTime(startingIndex++);
            comments.DateModified = reader.GetSafeDateTime(startingIndex++);

            if (comments.Id == 0)
            {
                return null;
            }

            return comments;
        }
    }
}
